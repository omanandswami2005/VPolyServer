import React from 'react';
import { useDarkMode } from '../../DarkModeContext';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const DarkModeToggler = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      {/* <p>Dark Mode: {isDarkMode ? 'On' : 'Off'}</p> */}
      <Switch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        icon={<Brightness4Icon />} // Dark mode icon
        checkedIcon={<WbSunnyIcon />} // Light mode icon
      />
    </div>
  );
};

export default DarkModeToggler;
