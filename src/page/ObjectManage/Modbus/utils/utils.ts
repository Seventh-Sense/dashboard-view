export const dataTypeOptions = ['16int', '16uint', '32int', '32uint'].map(v => ({
  label: v,
  value: v
}))

export const regTypeOptions = [
  {
    label: 'Input Registers',
    value: 'Input Registers'
  },
  {
    label: 'Holding Registers',
    value: 'Holding Registers'
  },
  {
    label: 'Digital Input',
    value: 'Digital Input'
  },
  {
    label: 'Coils',
    value: 'Coils'
  }
]

export const codingOptions = [
  {
    label: 'AB',
    value: 'AB'
  },
  {
    label: 'BA',
    value: 'BA'
  },
  {
    label: 'ABCD',
    value: 'ABCD'
  },
  {
    label: 'BADC',
    value: 'BADC'
  },
  {
    label: 'CDAB',
    value: 'CDAB'
  },
  {
    label: 'DCBA',
    value: 'DCBA'
  }
]
