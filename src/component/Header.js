import React from "react";
const Header = ({city,  methods, setMethod, defaultMethod}) => {
    return (
        <header>
            <div className="header-wrapper">
                <h1>Iftar and Sehri Time in <u>{city}</u></h1>
                <div className="method">
                    {/* <h3>Choose a method: </h3> */}
                    <select onChange={e => setMethod(Number(e.target.value))} name="method" defaultValue={defaultMethod}>
                        {methods.map(method => method.name && <option key={method.id} value={method.id}>{method.name}</option>)}
                    </select>
                </div>
            </div>
        </header>
    );
}

export default Header;