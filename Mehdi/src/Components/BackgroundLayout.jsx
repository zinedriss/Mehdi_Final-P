//images
import Rainy from '../assets/images/Rainy.jpg'
// import Clear from '../assets/images/Clear.jpg'
// import Fog from '../assets/images/fog.png'
// import Cloudy from '../assets/images/Cloudy.jpg'
// import Snow from '../assets/images/snow.jpg'
//import Stormy from '../assets/images/Stormy.jpg'
// import Sunny from '../assets/images/Sunny.jpg'


function BackgroundLayout() {
  return (
    <img src={Rainy} alt="weather_image" className='h-full  w-full fixed left-0 top-0 -z-[10]' />
  )
}

export default BackgroundLayout