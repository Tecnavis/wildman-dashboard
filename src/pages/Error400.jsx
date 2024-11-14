import React from 'react'
import ErrorContent from '../components/error/ErrorContent'

const Error400 = () => {
  return (
    <ErrorContent imgSrc={"assets/images/404.webp"} alt={'400'} subtitle={'Bad Request'}/>
  )
}

export default Error400