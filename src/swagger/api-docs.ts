/**
 * @swagger
 * /api/getUserData:
 *   get:
 *     summary: Get user data from ICP canister
 *     description: Retrieves user data from an ICP canister by principal ID
 *     tags: [ICP]
 *     parameters:
 *       - in: query
 *         name: principal
 *         required: true
 *         schema:
 *           type: string
 *         description: ICP Principal ID (e.g., bx77d-5qpr6-p3fkb-kcipj-iqpre-bqges-v443n-fwcaf-lbpvg-cn4xk-cae)
 *     responses:
 *       200:
 *         description: User data successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 *       400:
 *         description: Bad request, invalid principal ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api/getMemecoinPrice:
 *   get:
 *     summary: Get memecoin price and metadata from Solana
 *     description: Retrieves token metadata and price information from Solana blockchain
 *     tags: [Solana]
 *     parameters:
 *       - in: query
 *         name: contract
 *         required: true
 *         schema:
 *           type: string
 *         description: Solana token address (e.g., DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263)
 *     responses:
 *       200:
 *         description: Token data successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenData'
 *       400:
 *         description: Bad request, invalid token address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 