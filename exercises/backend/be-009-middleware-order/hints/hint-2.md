# Hint 2 (Medium)

Map out the dependency chain:
- `loggingMiddleware` depends on `requestIdMiddleware` (needs `req.requestId`)
- `adminOnlyMiddleware` depends on `authMiddleware` (needs `req.user`)
- `authMiddleware` might need `bodyParserMiddleware` (needs `req.body`)

So the order should be: requestId -> logging -> bodyParser -> auth -> adminOnly
