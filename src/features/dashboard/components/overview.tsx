import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'يناير',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'فبراير',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'مارس',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'أبريل',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'مايو',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'يونيو',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'يوليو',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'أغسطس',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'سبتمبر',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'أكتوبر',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'نوفمبر',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'ديسمبر',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
