export const connectionOptions = ['Serial Port'].map(v => ({
  label: v,
  value: v
}))

export const serialOptions = ['/dev/ttyS3', '/dev/ttyS4'].map(v => ({
  label: v,
  value: v
}))

export const baudOptions = [
  300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 56000, 57600, 115200, 128000, 256000
].map(v => ({
  label: v,
  value: v
}))

export const databitOptions = [7, 8].map(v => ({
  label: v,
  value: v
}))

export const parityOptions = ['None', 'Odd', 'Even'].map(v => ({
  label: v,
  value: v
}))

export const stopbitOptions = [1, 2].map(v => ({
  label: v,
  value: v
}))

