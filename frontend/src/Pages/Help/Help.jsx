import React from 'react'
import './Help.css'

const Help = () => {
  return (
    <div>
        <h1>How to Get API Key and Secret Key</h1>

        <div class="step">
            <h2>Step 1: Sign Up / Log In on codeforces</h2>
        </div>

        <div class="step">
            <h2>Step 2: Navigate to <a href="https://codeforces.com/settings/api" target='blank'>this link</a>  </h2>
        </div>

        <div class="step">
            <h2>Step 3: Click on Add Api key</h2>
        </div>

        <div class="step">
            <h2>Step 4: Enter the api name and password you want to give by your choice and click on Generate</h2>
        </div>

        <div class="step">
            <h2>Step 5: Your 40 digit api key and secret key will be generated</h2>
        </div>

    </div>
  )
}

export default Help