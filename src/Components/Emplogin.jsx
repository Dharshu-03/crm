import React from 'react'
import './Emplogin.css'

const Emplogin = () => {
    return (
        <div className='emplogin'>

            <form className='emploginform' action="">
                <div>
                    <h1>Canova</h1><p>CRM</p>
                </div>
                <input type="email" placeholder='email' />
                <input type="password" placeholder='password' />
                <button type='submit'>submit</button>
            </form>


        </div>
    )
}
export default Emplogin;