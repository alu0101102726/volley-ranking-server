
const fs = require("fs");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The user ID.
 *                 example: 0
 *               name:
 *                  type: string
 *                  description: The user's name.
 *                  example: Leanne Graham
 *               email:
 *                  type: string
 *                  description: The user's email.
 *                  example: example@gmail.com
 *               photo:
 *                  type: string
 *                  description: The user's profile picture.
 *               votes:
 *                  type: string
 *                  description: The user's votes.
 *     responses:
 *       201:
 *         description: Created
*/
router.post('/register', function(req, res) {    
    const data = JSON.parse(Object.keys(req.body));
    data.votes = [];
    const pathUser = `../users/${data.id}.json`;
    if (fs.existsSync(pathUser)) {
        fs.writeFileSync(pathUser, JSON.stringify(data));
    }
    res.end();
});