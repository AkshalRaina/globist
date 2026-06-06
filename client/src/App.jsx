import { Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Reels from './pages/Reels.jsx';
import Explore from './pages/Explore.jsx';
import Region from './pages/Region.jsx';
import TripDetail from './pages/TripDetail.jsx';
import Booking from './pages/Booking.jsx';
import PostReel from './pages/PostReel.jsx';
import Profile from './pages/Profile.jsx';
import MyTrips from './pages/MyTrips.jsx';
import Menu from './pages/Menu.jsx';

export default function App() {
  return (
    <div id="root">
      <div className="phone">
        <div className="phone-inner">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/region/:id" element={<Region />} />
            <Route path="/region" element={<Region />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/trip" element={<TripDetail />} />
            <Route path="/booking/:tripId" element={<Booking />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/post-reel" element={<PostReel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
