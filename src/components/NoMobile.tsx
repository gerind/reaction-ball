import React from 'react'

const styles: React.CSSProperties = {
  position: 'absolute',
  background: 'white',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '100%',
  border: '5px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  fontSize: '42px',
}

const NoMobile: React.FC = () => {
  return <div style={styles}>Недоступно на мобильных устройствах</div>
}

export default NoMobile
