// ✅ You said your database.js exposes { sql, connectDB } so let's use only that
// Final working login route with pure Node.js

const http = require('http');
const { parse,URL } = require('url');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, connectDB } = require('./Database/database'); // Using your DB config file
const API_BASE = 'http://localhost:5000/api';
const cloudinary =require('cloudinary').v2
const stringSimilarity = require('string-similarity');
const geolib = require('geolib');

cloudinary.config({
  cloud_name: 'abdullahcloud', // Replace with your Cloudinary cloud name
  api_key: '259835984394572', // Replace with your Cloudinary API key
  api_secret: 'qiMO9VfDsUeosR4Njt8ulbg1FJY' // Replace with your Cloudinary API secret
});

const SECRET = 'your_jwt_secret'; // Change this in production

async function getLocationScore(loc1, loc2) {
  // loc format: "Lat: 31.5826, Lng: 74.3276"
  const lat1 = parseFloat(loc1.match(/Lat:\s*([\d.-]+)/)[1]);
  const lon1 = parseFloat(loc1.match(/Lng:\s*([\d.-]+)/)[1]);
  const lat2 = parseFloat(loc2.match(/Lat:\s*([\d.-]+)/)[1]);
  const lon2 = parseFloat(loc2.match(/Lng:\s*([\d.-]+)/)[1]);

  const distance = geolib.getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );

  const maxDistance = 5000; // 5km max
  return Math.max(0, 1 - distance / maxDistance);
}

async function getDateProximityScore(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
  const maxDays = 30; // max 30 days difference
  return Math.max(0, 1 - diffDays / maxDays);
}

async function calculateMatchScore(lostItem, foundItem) {
  const nameSimilarity = stringSimilarity.compareTwoStrings(
    lostItem.itemName.toLowerCase(),
    foundItem.itemName.toLowerCase()
  );

  const categoryMatch = lostItem.categoryId === foundItem.categoryId ? 1 : 0;

  const locationSimilarity = await getLocationScore(lostItem.location, foundItem.location);

  const dateProximityScore = await getDateProximityScore(lostItem.createdAt, foundItem.createdAt);

  const descriptionSimilarity = stringSimilarity.compareTwoStrings(
    lostItem.description.toLowerCase(),
    foundItem.description.toLowerCase()
  );

  const score =
    0.4 * nameSimilarity +
    0.2 * categoryMatch +
    0.15 * locationSimilarity +
    0.15 * dateProximityScore +
    0.1 * descriptionSimilarity;

  return score;
}


function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}


const server = http.createServer(async (req, res) => {
  const url = parse(req.url, true);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { email, password } = JSON.parse(body);
        if (!email || !password) {
          sendJSON(res, 400, { message: 'Email and password are required' });
          return;
        }

        await connectDB();
        const result = await sql.query`
          SELECT userid, hash_password FROM Users WHERE email = ${email}
        `;

        const user = result.recordset[0];
        if (!user) {
          sendJSON(res, 401, { message: 'User not found' });
          return;
        }

        const valid = await bcrypt.compare(password, user.hash_password);
        if (!valid) {
          sendJSON(res, 401, { message: 'Incorrect password' });
          return;
        }

        const token = jwt.sign({ userid: user.userid, email }, SECRET, { expiresIn: '1h' });
        sendJSON(res, 200, { uID: user.userid, token });
      } catch (err) {
        console.error(err);
        sendJSON(res, 500, { message: 'Server error' });
      }
    });
    return;
  }
else  if (req.method === 'POST' && url.pathname === '/signup') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { firstName, lastName, email, password } = JSON.parse(body);
  
        if (!firstName || !lastName || !email || !password) {
          sendJSON(res, 400, { message: 'All fields are required' });
          return;
        }
  
        await connectDB(); // Ensure DB is connected
  
        const checkUser = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
        if (checkUser.recordset.length > 0) {
          sendJSON(res, 409, { message: 'Email already exists' });
          return;
        }
  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        await sql.query`
          INSERT INTO Users (firstName, lastName, email, hash_password)
          VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword})
        `;
  
        sendJSON(res, 201, { message: 'Signup successful' });
      } catch (err) {
        console.error(err);
        sendJSON(res, 500, { message: 'Server error during signup' });
      }
    });
    return;
  }
  
 else if (req.method === 'POST' && url.pathname === '/report-lost-item') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const {
          itemName,
          description,
          location,
          contactInfo,
          itemCategory,
          acceptedTerms,
          imageUrl,
          uID,
        } = JSON.parse(body);
  
        // Validation check
        if (
          !itemName || !description || !location || !contactInfo ||
          !itemCategory || !acceptedTerms || !uID
        ) {
          sendJSON(res, 400, { message: 'All fields are required' });
          return;  // STOP after sending response
        }
  
        await connectDB();
        console.log(itemCategory);
        const categoryResult = await sql.query`
          SELECT categoryId FROM Categories WHERE categoryName = ${itemCategory}
        `;
  
        if (categoryResult.recordset.length === 0) {
          sendJSON(res, 400, { message: 'Invalid category' });
          return;  // STOP here too
        }
  
        const categoryID = categoryResult.recordset[0].categoryId;
  
        await sql.query`
          INSERT INTO LostItems (
            itemName, description, location, contactInfo, categoryID,
            image, userID, likesCount, noOfComments, createdAt
          ) VALUES (
            ${itemName}, ${description}, ${location}, ${contactInfo}, ${categoryID},
            ${imageUrl}, ${uID}, 0, 0, GETDATE()
          )
        `;
  
        sendJSON(res, 201, { message: 'Item reported successfully' });
        return; // always safe to put return after sending response
  
      } catch (err) {
        console.error(err);
        if (!res.writableEnded) {  // check if response is not yet sent
          sendJSON(res, 500, { message: 'Error reporting item' });
        }
        // no return needed here as this is the last block
      }
    });
  }
  else if (req.method === 'GET' && url.pathname === '/api/lost-items') {
    try {
      await connectDB();
  
      const search = url.query.search?.trim() || '';
      const range = url.query.range || '';
  
      let query = `
        SELECT 
          l.id,
          l.itemName,
          l.description,
          l.location,
          l.contactInfo,
          l.image,
          l.likesCount,
          l.noOfComments,
          l.createdAt,
          c.categoryName,
          u.firstName,
          u.lastName
        FROM LostItems l
        INNER JOIN Categories c ON l.categoryID = c.categoryId
        INNER JOIN Users u ON l.userID = u.userid
        WHERE 1=1
      `;
  
      if (search) {
        query += ` AND (l.itemName LIKE '%' + @search + '%' OR l.description LIKE '%' + @search + '%')`;
      }
  
      if (range === '24h') {
        query += ` AND l.createdAt >= DATEADD(HOUR, -24, GETDATE())`;
      } else if (range === 'week') {
        query += ` AND l.createdAt >= DATEADD(DAY, -7, GETDATE())`;
      } else if (range === 'month') {
        query += ` AND l.createdAt >= DATEADD(MONTH, -1, GETDATE())`;
      }
  
      query += ' ORDER BY l.createdAt DESC';
  
      const request = new sql.Request();
      if (search) {
        request.input('search', sql.NVarChar, search);
      }
      const result = await request.query(query);
  
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(result.recordset));
    } catch (err) {
      console.error('Lost items fetch error:', err);
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch lost items' }));
      }
    }
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/likes') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { itemId, userId } = JSON.parse(body);
  
        if (!itemId || !userId) {
          sendJSON(res, 400, { message: 'Missing itemId or userId' });
          return;
        }
  
        await connectDB();
  
        // Check if like already exists
        const likeCheck = await sql.query`
          SELECT * FROM Likes WHERE lostItemId = ${itemId} AND userId = ${userId}
        `;
  
        if (likeCheck.recordset.length > 0) {
          sendJSON(res, 200, { message: 'Already liked' });
          return;
        }
  
        // Insert new like
        await sql.query`
          INSERT INTO Likes (lostItemId, userId) VALUES (${itemId}, ${userId})
        `;
  
        // Update likesCount in LostItems
        await sql.query`
          UPDATE LostItems SET likesCount = likesCount + 1 WHERE id = ${itemId}
        `;
  
        sendJSON(res, 200, { message: 'Like added successfully' });
      } catch (err) {
        console.error('Failed to add like:', err);
        sendJSON(res, 500, { message: 'Failed to add like' });
      }
    });
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/comments') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { itemId, userId, commentText } = JSON.parse(body);
  
        if (!itemId || !userId || !commentText) {
          sendJSON(res, 400, { message: 'Missing itemId, userId, or commentText' });
          return;
        }
  
        await connectDB();
  
        // Insert comment into Comments table
        await sql.query`
          INSERT INTO Comments (lostItemId, userId, commentText)
          VALUES (${itemId}, ${userId}, ${commentText})
        `;
  
        // Update noOfComments count in LostItems
        await sql.query`
          UPDATE LostItems SET noOfComments = noOfComments + 1 WHERE id = ${itemId}
        `;
  
        sendJSON(res, 201, { message: 'Comment added successfully' });
      } catch (err) {
        console.error('Failed to add comment:', err);
        sendJSON(res, 500, { message: 'Failed to add comment' });
      }
    });
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/report-found-item') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const {
          itemName,
          description,
          location,
          contactInfo,
          itemCategory,
          imageUrl,
          userId,
        } = JSON.parse(body);
  
        // Validate required fields
        if (
          !itemName ||
          !description ||
          !location ||
          !contactInfo ||
          !itemCategory ||
          !userId
        ) {
          sendJSON(res, 400, { message: 'All fields are required' });
          return;
        }
  
        await connectDB();
  
        // Get category ID from category name
        const categoryResult = await sql.query`
          SELECT categoryId FROM Categories WHERE categoryName = ${itemCategory}
        `;
  
        if (categoryResult.recordset.length === 0) {
          sendJSON(res, 400, { message: 'Invalid category' });
          return;
        }
  
        const categoryID = categoryResult.recordset[0].categoryId;
  
        // Insert found item record
        await sql.query`
          INSERT INTO FoundItems (
            itemName, description, location, contactInfo, categoryID,
            image, userID, likesCount, noOfComments
          ) VALUES (
            ${itemName}, ${description}, ${location}, ${contactInfo}, ${categoryID},
            ${imageUrl || ''}, ${userId}, 0, 0
          )
        `;
  
        sendJSON(res, 201, { message: 'Found item reported successfully' });
      } catch (err) {
        console.error('Error reporting found item:', err);
        if (!res.writableEnded) {
          sendJSON(res, 500, { message: 'Error reporting found item' });
        }
      }
    });
    return;
  }
  else if (req.method === 'GET' && url.pathname === '/api/found-items') {
    try {
      await connectDB();
  
      const search = (url.query.search || '').trim();
      const range = url.query.range || '';
  
      let query = `
        SELECT
          f.id,
          f.itemName,
          f.description,
          f.location,
          f.contactInfo,
          f.image as image,
          f.likesCount,
          f.noOfComments,
          f.createdAt,
          c.categoryName,
          u.firstName,
          u.lastName
        FROM FoundItems f
        INNER JOIN Categories c ON f.categoryID = c.categoryId
        INNER JOIN Users u ON f.userID = u.userid
        WHERE 1=1
      `;
  
      if (search) {
        query += ` AND (f.itemName LIKE '%' + @search + '%' OR f.description LIKE '%' + @search + '%')`;
      }
  
      if (range === '24h') {
        query += ` AND f.createdAt >= DATEADD(HOUR, -24, GETDATE())`;
      } else if (range === 'week') {
        query += ` AND f.createdAt >= DATEADD(DAY, -7, GETDATE())`;
      } else if (range === 'month') {
        query += ` AND f.createdAt >= DATEADD(MONTH, -1, GETDATE())`;
      }
  
      query += ' ORDER BY f.createdAt DESC';
  
      const request = new sql.Request();
      if (search) {
        request.input('search', sql.NVarChar, search);
      }
      const result = await request.query(query);
  
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(result.recordset));
    } catch (err) {
      console.error('Error fetching found items:', err);
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch found items' }));
      }
    }
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/found-likes') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { foundItemId, userId } = JSON.parse(body);
  console.log("found item id ",foundItemId,"userID",userId);
        if (!foundItemId || !userId) {
          sendJSON(res, 400, { message: 'Missing foundItemId or userId' });
          return;
        }
  
        await connectDB();
  
        // Check if already liked
        const likeExists = await sql.query`
          SELECT * FROM FoundLikes WHERE foundItemId = ${foundItemId} AND userId = ${userId}
        `;
  
        if (likeExists.recordset.length > 0) {
          sendJSON(res, 200, { message: 'Already liked' });
          return;
        }
  
        // Insert like
        await sql.query`
          INSERT INTO FoundLikes (foundItemId, userId)
          VALUES (${foundItemId}, ${userId})
        `;
  
        // Update likesCount in FoundItems table
        await sql.query`
          UPDATE FoundItems SET likesCount = likesCount + 1 WHERE id = ${foundItemId}
        `;
  
        sendJSON(res, 200, { message: 'Like added successfully' });
  
      } catch (err) {
        console.error('Failed to like found item:', err);
        sendJSON(res, 500, { message: 'Failed to like found item' });
      }
    });
    return;
  }
  else if (req.method === 'POST' && url.pathname === '/api/found-comments') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      try {
        const { foundItemId, userId, commentText } = JSON.parse(body);
  
        if (!foundItemId || !userId || !commentText) {
          sendJSON(res, 400, { message: 'Missing foundItemId, userId, or commentText' });
          return;
        }
  
        await connectDB();
  
        // Insert comment
        await sql.query`
          INSERT INTO FoundComments (foundItemId, userId, commentText)
          VALUES (${foundItemId}, ${userId}, ${commentText})
        `;
  
        // Update comment count in FoundItems
        await sql.query`
          UPDATE FoundItems SET noOfComments = noOfComments + 1 WHERE id = ${foundItemId}
        `;
  
        sendJSON(res, 201, { message: 'Comment added successfully' });
  
      } catch (err) {
        console.error('Failed to add comment on found item:', err);
        sendJSON(res, 500, { message: 'Failed to add comment on found item' });
      }
    });
    return;
  }
  else if (req.method === 'GET' && url.pathname === '/api/matches/best-match') {
    const lostItemId = parseInt(url.query.lostItemId, 10);
    if (isNaN(lostItemId)) {
      return sendJSON(res, 400, { error: 'Valid lostItemId is required' });
    }
  
    try {
      await connectDB();
  
      // Get lost item
      const lostItemResult = await sql.query`SELECT * FROM LostItems WHERE id = ${lostItemId}`;
      const lostItem = lostItemResult.recordset[0];
      if (!lostItem) {
        return sendJSON(res, 404, { error: 'Lost item not found' });
      }
  
      // Get all found items
      const foundItemsResult = await sql.query`SELECT * FROM FoundItems`;
      const foundItems = foundItemsResult.recordset;
  
      if (!foundItems || foundItems.length === 0) {
        return sendJSON(res, 404, { error: 'No found items available' });
      }
  
      // Match scoring
      const matchCalculations = await Promise.all(
        foundItems.map(async (foundItem) => {
          const score = await calculateMatchScore(lostItem, foundItem);
          return score > 0.3 ? { lostItemId, foundItemId: foundItem.id, score } : null;
        })
      );
  
      const matches = matchCalculations.filter(Boolean);
  
      // Insert or update
      for (const match of matches) {
        const existingMatch = await sql.query`
          SELECT * FROM Matches WHERE lostItemId = ${match.lostItemId} AND foundItemId = ${match.foundItemId}
        `;
        if (existingMatch.recordset.length > 0) {
          await sql.query`
            UPDATE Matches SET matchScore = ${match.score} WHERE lostItemId = ${match.lostItemId} AND foundItemId = ${match.foundItemId}
          `;
        } else {
          await sql.query`
            INSERT INTO Matches (lostItemId, foundItemId, matchScore) VALUES (${match.lostItemId}, ${match.foundItemId}, ${match.score})
          `;
        }
      }
  
      // Return sorted matches
      matches.sort((a, b) => b.score - a.score);
      return sendJSON(res, 200, { matches });
  
    } catch (err) {
      console.error('Error computing best match:', err);
      return sendJSON(res, 500, { error: 'Internal server error' });
    }
  }else if (req.method === 'GET' && url.pathname === '/api/user/lost-items') {
    try {
      const userId = url.query.userId;
      if (!userId) {
        sendJSON(res, 400, { message: 'Missing userId query parameter' });
        return;
      }
  
      await connectDB();
  
      const query = `
        SELECT
          l.id,
          l.itemName,
          l.description,
          l.location,
          l.contactInfo,
          l.image,
          l.likesCount,
          l.noOfComments,
          l.createdAt,
          c.categoryName
        FROM LostItems l
        INNER JOIN Categories c ON l.categoryID = c.categoryId
        WHERE l.userID = @userId
        ORDER BY l.createdAt DESC
      `;
  
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(query);
  
      sendJSON(res, 200, result.recordset);
    } catch (err) {
      console.error('Error fetching user lost items:', err);
      sendJSON(res, 500, { message: 'Failed to fetch lost items' });
    }
    return;
  }else if (req.method === 'GET' && url.pathname === '/api/user/found-items') {
    try {
      const userId = url.query.userId;
      if (!userId) {
        sendJSON(res, 400, { message: 'Missing userId query parameter' });
        return;
      }
  
      await connectDB();
  
      const query = `
        SELECT
          f.id,
          f.itemName,
          f.description,
          f.location,
          f.contactInfo,
          f.image,
          f.likesCount,
          f.noOfComments,
          f.createdAt,
          c.categoryName
        FROM FoundItems f
        INNER JOIN Categories c ON f.categoryID = c.categoryId
        WHERE f.userID = @userId
        ORDER BY f.createdAt DESC
      `;
  
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(query);
  
      sendJSON(res, 200, result.recordset);
    } catch (err) {
      console.error('Error fetching user found items:', err);
      sendJSON(res, 500, { message: 'Failed to fetch found items' });
    }
    return;
  }
 
  else if (req.method === 'GET' && url.pathname === '/api/user/stats') {
    try {
      const userId = url.query.userId;
      if (!userId) {
        sendJSON(res, 400, { message: 'Missing userId query parameter' });
        return;
      }
  
      await connectDB();
      const request = new sql.Request();
      request.input('userId', sql.Int, userId);
         const user = await request.query(
          `SELECT * FROM Users WHERE userid =@userId`
         )
      // Total Lost and Found
      const totalLost = await request.query(`
        SELECT COUNT(*) AS totalLost FROM LostItems WHERE userID = @userId
      `);
      const totalFound = await request.query(`
        SELECT COUNT(*) AS totalFound FROM FoundItems WHERE userID = @userId
      `);
  
      // Lost Items by Category
      const lostByCategory = await request.query(`
        SELECT c.categoryName, COUNT(*) AS count
        FROM LostItems l
        JOIN Categories c ON l.categoryID = c.categoryId
        WHERE l.userID = @userId
        GROUP BY c.categoryName
      `);
  
      // Found Items by Category
      const foundByCategory = await request.query(`
        SELECT c.categoryName, COUNT(*) AS count
        FROM FoundItems f
        JOIN Categories c ON f.categoryID = c.categoryId
        WHERE f.userID = @userId
        GROUP BY c.categoryName
      `);
  
      // Lost Items per Month (last 6 months)
      const lostPerMonth = await request.query(`
        SELECT 
          DATENAME(MONTH, createdAt) + ' ' + CAST(YEAR(createdAt) AS VARCHAR) AS month,
          COUNT(*) AS count
        FROM LostItems
        WHERE userID = @userId AND createdAt >= DATEADD(MONTH, -5, GETDATE())
        GROUP BY YEAR(createdAt), MONTH(createdAt), DATENAME(MONTH, createdAt)
        ORDER BY YEAR(createdAt), MONTH(createdAt)
      `);
  
      // Found Items per Month (last 6 months)
      const foundPerMonth = await request.query(`
        SELECT 
          DATENAME(MONTH, createdAt) + ' ' + CAST(YEAR(createdAt) AS VARCHAR) AS month,
          COUNT(*) AS count
        FROM FoundItems
        WHERE userID = @userId AND createdAt >= DATEADD(MONTH, -5, GETDATE())
        GROUP BY YEAR(createdAt), MONTH(createdAt), DATENAME(MONTH, createdAt)
        ORDER BY YEAR(createdAt), MONTH(createdAt)
      `);
  
      // Convert category arrays to plain objects
      const lostCatMap = {};
      lostByCategory.recordset.forEach(row => {
        lostCatMap[row.categoryName] = row.count;
      });
  
      const foundCatMap = {};
      foundByCategory.recordset.forEach(row => {
        foundCatMap[row.categoryName] = row.count;
      });
  
      const lostMonthMap = {};
      lostPerMonth.recordset.forEach(row => {
        lostMonthMap[row.month] = row.count;
      });
  
      const foundMonthMap = {};
      foundPerMonth.recordset.forEach(row => {
        foundMonthMap[row.month] = row.count;
      });
  
      sendJSON(res, 200, {
        user:user.recordset[0],
        totalLost: totalLost.recordset[0].totalLost,
        totalFound: totalFound.recordset[0].totalFound,
        lostByCategory: lostCatMap,
        foundByCategory: foundCatMap,
        lostPerMonth: lostMonthMap,
        foundPerMonth: foundMonthMap
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      sendJSON(res, 500, { message: 'Failed to fetch dashboard statistics' });
    }
    return;
  }
  else {
    
  }
});

server.listen(5000, () => console.log('Server running on http://localhost:5000'));
