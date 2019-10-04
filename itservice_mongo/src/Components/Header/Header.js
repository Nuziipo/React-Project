import React, { Component } from 'react'
import { Link } from 'react-router'
import { Collapse, NavbarToggler, NavbarBrand } from 'reactstrap';

class Header extends Component {
    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    renderLinks() {
        return[
            <li className="nav-item" key={2} >
                 <Link to="/work" className="nav-link">แจ้งซ่อม</Link> 
            </li>, 
            <li className="nav-item" key={3} >
                <Link to="/workrepair" className="nav-link">งานซ่อม</Link> 
            </li>,
            <li className="nav-item" key={4} >
                <Link to="/location" className="nav-link">สถานที่</Link> 
            </li>,
            <li className="nav-item" key={5} >
                <Link to="/user" className="nav-link">ผู้ใช้งาน</Link> 
            </li>,    
        ]   
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <NavbarBrand href="/">AROMDEE DERRIVERRY</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <ul className="navbar-nav">
                        {this.renderLinks()}
                    </ul>
                </Collapse>
            </nav>
        )
    }
}


export default Header