require('dotenv').config()
const Redis = require('ioredis')

const connect = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 75
})

const useRedis = async (req, res, next) => {
  try {
    const { sort, typeSort, page, limit } = req.query

    const data = await connect.get('data')
    const url = await connect.get('url')
    const sortRedis = await connect.get('sort')
    const typeSortRedis = await connect.get('typeSort')
    const pageRedis = await connect.get('page')
    const limitRedis = await connect.get('limit')
    const total_all_dataRedis = await connect.get('total_all_data')

    const isSame =
      url === req.originalUrl &&
      (sort ?? null) === sortRedis &&
      (typeSort ?? null) === typeSortRedis &&
      (page ?? null) === pageRedis &&
      (limit ?? null) === limitRedis &&
      data

    if (isSame) {
      res.status(200).json({
        redis: true,
        status: true,
        message: 'Data retrieved successfully !',
        sort: sort,
        typeSort: typeSort,
        page: parseInt(page) ?? 1,
        limit: parseInt(limit),
        total_data: parseInt(total_all_dataRedis),
        total: JSON.parse(data).length,
        data: JSON.parse(data)
      })
    } else {
      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = { useRedis, connect }
