import React from 'react';
import { Router, Outlet, ReactLocation } from "@tanstack/react-location";
import routes from './components/Routes';
// for notification
import { Toaster } from 'react-hot-toast';
// Set up a ReactLocation instance
const location = new ReactLocation();

const App = () => {

   return (
      <>
         {/* <Helmet>
            <title>Report solution</title>
            <meta name="description" content={'Made easy for ak hasap users'} />
            <meta property="og:title" content={'Report solution'} />
            <meta property="og:description" content={'Made easy for ak hasap users'} />
            <meta property="og:image" content={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvNx3E7KZm1plHf4JxBR5xJ5EY5x4lYMx8GWVKRB3KLYUTzsDuEszA1Rc1cUlyom4BNRY&usqp=CAU'} />
            <meta property="og:url" content={'http://tudana.com.tm:1001'} />
            <meta property="og:type" content="website" />
         </Helmet> */}
         <Toaster
            position="top-center"
            reverseOrder={false}
         />
         <Router
            location={location}
            routes={routes}
         >
            <Outlet />
         </Router>
      </>
   )
}

export default App;