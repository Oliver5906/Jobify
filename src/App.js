import React, { Suspense, useEffect, useState } from 'react'
// ** Router Import
import { lazy } from 'react'
const LoginBasic = lazy(() => import('./views/pages/authentication/LoginBasic'))
const RegisterBasic = lazy(() => import('./views/pages/authentication/RegisterBasic'))
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Spinner from './@core/components/spinner/Fallback-spinner'
import getUserData from './functions/getUserData';
import AuthPage from './views/pages/authentication/auth';

import NavComponent from './@core/layouts/components/navbar/index';
import EcommerceDashboard from './views/dashboard/ecommerce/index';
import WithoutMenu from './views/ui-elements/page-layouts/WithoutMenu';
import { Navbar } from 'reactstrap';
import './style.css'
import logo from './assets/images/logo/logo.png'
import ShareProjectExample from './views/pages/modal-examples/ShareProject';
import Verify from './views/pages/authentication/verify';


const App = () => {
  
  const [userData, setUserData] = useState(false)
  const [status, setStatus] = useState(false)

  useEffect(() => {
    const authorization = localStorage.getItem("authorization")
    if(!authorization) return setUserData("false")
    getUserData(authorization).then(data => {
      if(data.state === 0 && data.code === 55) {
        localStorage.removeItem("authorization")
        return setUserData("false")
      }
      setUserData(data)
    }).catch(() => {
      // localStorage.removeItem("authorization")
      return setUserData("false")
    })
  },[])

  function getFirstLetterOfWords(text, count) {
    const words = text.split(' '); 
    let result = '';

    for (let i = 0; i < Math.min(count, words.length); i++) {
        result += words[i][0]; 
    }

    return result;
  }

  function EditName(text) {
    const words = text.split(''); 
    let result = '';
    var tr;
    for (let i = 0; i < 13; i++) {
        if (words[i]) result += words[i]; 
        else tr = true
    }
    if (!tr) result+="...."
    return result;
  }

  return (
    <div>
      {!userData ? <Spinner /> : userData === "false" ?
      <Suspense fallback={null}>
        <Router>
          <Routes>
            <Route path="/" element={<RegisterBasic />} />
            <Route path="/verify/:key/:value" element={<Verify />} />
            <Route path="/auth" element={<AuthPage/>} />
            <Route path="*" element={<div>404 not found this page</div>} />
          </Routes>
        </Router>
      </Suspense> : 
      <Suspense fallback={null}>
        <Router>
          <Routes>
            <Route path="/" element={
            <div>
              <nav style={{"left":"0","right":"0","width":"96%"}} className={"header-navbar navbar align-items-center floating-nav container-xxl navbar-shadow navbar navbar-expand-lg navbar-light"}>
                <div className={"navbar-container d-flex content"}>
                    <NavComponent userInfo={userData.userInfo}/>
                </div>
              </nav>
              {/* <WithoutMenu/> */}
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <section className="applications">
              <h2>Your Servers</h2>
                {userData.guildsInfo.map(guild => (
                  <Link to={`/dashboard/guild/${guild.id}`}>
                  <div className="app-card">
                    <div className="app-logo image-container">
                        <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`: "https://cdn.discordapp.com/attachments/1068301728937685044/1149509437351006238/image.png"} /> 
                        {guild.icon ? "" :
                        <div className="image-overlay">
                          <p>{getFirstLetterOfWords(guild.name, 4)}</p>
                        </div>}
                    </div>
                    <div className="app-details">
                          <h3>{EditName(guild.name)}</h3>
                    </div>
                  </div>
                  </Link>
                ))}
              </section>
<a href="https://discord.com/oauth2/authorize?client_id=1134344435715538954&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=token&scope=bot">
              <div class="circle-marker">
        <span>+</span>
    </div>
    </a>
            </div>} />
            <Route path="/auth" element={<AuthPage/>} />
            <Route path="/verify/:key/:value" element={<Verify />} />
            <Route path="/dashboard/guild/:guild_id" element={<div>
              <nav style={{"left":"0","right":"0","width":"96%"}} className={"header-navbar navbar align-items-center floating-nav container-xxl navbar-shadow navbar navbar-expand-lg navbar-light"}>
                <div className={"navbar-container d-flex content"}>
                    <NavComponent userInfo={userData.userInfo}/>
                </div>
              </nav>
              <WithoutMenu guilds={userData.guildsInfo}/>
              </div>
              } />

            <Route path="*" element={<div>404 not found this page</div>} />
          </Routes>
        </Router>
      </Suspense>
 }
    </div>
  )
}

export default App
