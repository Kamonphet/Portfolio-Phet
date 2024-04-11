import React from 'react'
import "./Sidebar.css"
import Logo from "../../assets/logo.svg"

const Sidebar = () => {
  return (
    <aside className='aside'>
      <a href="#home" className='nav__logo'>
        <img src={Logo} alt="" />
      </a>

      <nav className='nav'>
        <div className='nav__menu'>
          <ul className='nav__list'>
            <li className='nav__item'>
              <a href="#home" className='nav__link'>
                <i class='bx bx-home-alt-2' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#about" className='nav__link'>
                <i class='bx bx-info-circle' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#service" className='nav__link'>
              <i class='bx bx-briefcase' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#resume" className='nav__link'>
                <i class='bx bxs-graduation' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#portfolio" className='nav__link'>
                <i class='bx bx-book' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#testimonials" className='nav__link'>
                <i class='bx bx-file-blank' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#blog" className='nav__link'>
                <i class='bx bx-edit' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>

            <li className='nav__item'>
              <a href="#contact" className='nav__link'>
                <i class='bx bx-phone' style={{color: "black",fontSize:"20px"}}></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className='nav__footer'>
        <span className='copyright'>&#169; 2022 -2023.</span>
      </div>
    </aside>
  )
}

export default Sidebar