import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import './Header.css';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';

export default function Header({ value }) {
  return (
    <div>
      <header>
        <Link to="/perfil">
          <img
            src={ profileIcon }
            alt="profile-icon"
            data-testid="profile-top-btn"
            className="profile-button"
          />
        </Link>
        <h1 data-testid="page-title">
          { value }
        </h1>
        <button type="button">
          <img src={ searchIcon } alt="search-icon" data-testid="search-top-btn" />
        </button>
      </header>
    </div>
  );
}

Header.propTypes = {
  value: PropTypes.node.isRequired,
};
