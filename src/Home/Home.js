import React, { Component } from 'react';
import { Link } from 'react-router-dom';

var once = false;


class Home extends Component {
  login() {
    this.props.auth.login();
  }
  constructor(props) {
      // Required step: always call the parent class' constructor
      super(props);
	  this.state = {
		changePassword: true,
		passwordOne: "",
		passwordTwo: "",
		test: 55
	  };
  }
  
  handleChange(e) {
    e.preventDefault();
	this.setState({[e.target.name]: e.target.value});
}
  
  isPasswordValid(inputPassword, inputPassword2){
		if(inputPassword !== inputPassword2){
			console.error("Password mismatch");
			return false;
			}
	  if(!inputPassword.match(/\d/)){
		return false;
	  }
	  if(inputPassword.length <8){
		  return false
	}
	return true
  }
  
  setFirstTimeLogin(newState){
	fetch("http://interview.armorblox.io/api/setFirstTimeLogin")
      .then(res => res.json())
      .then(
        (result) => {
			  this.setState({
				changePassword: result.change_password
			  });
        }
      )
  
  }
  
  setNewPassword(e){
    e.preventDefault();
    const {passwordOne, passwordTwo} = this.state;
	if(!this.isPasswordValid(passwordOne, passwordTwo)){
		console.log("Bad Password "+this.state.passwordOne);
		this.setState({
			errorMessage: "Password must be 8+ characters and contain a number"
		});
		return false
	}
	console.log("Setting password");
	/*
	fetch("http://interview.armorblox.io/api/setPassword")//Todo
      .then(res => res.json())
      .then(
        (result) => {
			this.setFirstTimeLogin(true);

        }
      )
	  */
	  
	this.setFirstTimeLogin(true);

	  
  }
  
  showChangePassword(){
	this.setState({
changePassword: !this.state.changePassword 
	}) 
	
  }
  componentDidMount(){
    fetch("http://interview.armorblox.io/api/getFirstTimeLogin")
      .then(res => res.json())
      .then(
        (result) => {
		  this.setState({
            changePassword: result.change_password
          });
        },
        (error) => {
         // this.se tState({
         //   isLoaded: true,
         //   error
         // });
        }
      )
	
  }
  
  render() {
	if(!once){
		var parent = this;
		once = true;
		setTimeout(function(){
		parent.render();
		},1002);
		
		
		
	}
	var profile;
    const { userProfile, getProfile } = this.props.auth;
	try {
    if (!userProfile) {
      getProfile((err, userProfile) => {
		profile = userProfile;
      });
    } else {
	  profile = userProfile
    }
	} catch(e){}
	
	  if(profile){
		window.DoD3(profile.name);
	}
  
	
    const { isAuthenticated } = this.props.auth;
	return (
      <div className="container">
        {
          isAuthenticated() && (
              <h4>
	            You are logged in{profile?" as "+profile.name:""}! You can now view your 
				<br/>
                <Link to="profile">profile area</Link>
				
				

                .
			  
			  <br/><br/><br/>
					<span onClick={this.showChangePassword.bind(this)}>
						<div className="btn btn-default">Toggle Change Password Display</div>
						</span>
				<br/>{
				 this.state.changePassword && 
					<form onSubmit={this.setNewPassword.bind(this)}>
					<input placeholder="Password" name="passwordOne" onChange={this.handleChange.bind(this)}  />
					<br/>
					<input placeholder="Re-enter password" name="passwordTwo" onChange={this.handleChange.bind(this)} />
					<br/>
					<input onClick={this.setNewPassword.bind(this)} type="submit" value="Update Password" />
					</form>
				
				}
				<br/>
              </h4>
			  
			  
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please{' '}
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={this.login.bind(this)}
                >
                  Log In
                </a>
                {' '}to continue.
              </h4>
            )
        }
      </div>
    );
  }
}
export default Home;
