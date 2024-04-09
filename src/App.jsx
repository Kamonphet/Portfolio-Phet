import './App.css'
import Service from './component/service/Service'
import Sidebar from './component/sidebar/Sidebar'
import Contact from './component/contact/Contact'
import About from  './component/about/About'
import Blog from  './component/blog/Blog'
import Home  from './component/home/Home'
import Resume from './component/resume/Resume'
import Portfolio from './component/portfolio/Portfolio'
import Testimonials from './component/testimonials/Testimonials'
function App() {

  return (
    <>
    <Sidebar/>
    <main className='main'>
      <Home/>
      <About/>
      <Service/>
      <Resume/>
      <Portfolio/>
      <Testimonials />
      <Blog />
      <Contact />      
    </main>
    </>
  )
}

export default App
