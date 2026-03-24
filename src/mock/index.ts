import Mock from 'mockjs'

Mock.setup({
  timeout: '200-600'
})

let mockData: any = null
;(async () => {
  const res = await fetch('/mock/iot-mock-data.json')
  mockData = await res.json()
})()

// Mock.mock(/iot\/devices$/, 'get', options => {
//   console.log('✅ Mock 精准拦截到请求：', options.url)

//   return {
//     code: 200,
//     status: 'OK',
//     data: [
//       {
//         uid: 'ModbusTCP,127.0.0.1:5020',
//         name: 'Test',
//         protocol: 'ModbusTCP',
//         status: '',
//         property: {
//           host: '127.0.0.1',
//           port: 5020,
//           connectionOption: 'tcp'
//         },
//         address: '1',
//         id: '910d43b7-303f-433c-acf0-034bf63db720',
//         enabled: true,
//         description: '',
//         tags: ''
//       }
//     ]
//   }
// })

// Mock.mock(/\/iot\/metrics\/[\w-]+/, 'get', () => {
//   console.log('mock', mockData)
//   return {
//     code: 200,
//     status: 'OK',
//     data: mockData
//   }
// })
