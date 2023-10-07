const Profile1 = ( props ) => {
    const userData = props.userData
    return (
        <div>
            <h1>This is the profile page {userData.name}</h1>

        </div>
    );
}

export default Profile1;