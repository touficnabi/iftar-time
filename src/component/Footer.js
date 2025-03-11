const Header = ({city,  methods, setMethod, defaultMethod}) => {
    return (
        <footer>
            <div className="header-wrapper">
                <div className="method">
                    <h3>Source: </h3>
                    <select onChange={setMethod} name="method" defaultValue={defaultMethod}>
                        {methods.map(method => method.name && <option key={method.id} value={method.id}>{method.name}</option>)}
                    </select>
                </div>
            </div>
        </footer>
    );
}

export default Header;