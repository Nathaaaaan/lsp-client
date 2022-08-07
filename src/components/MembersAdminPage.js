import React, { useEffect, useState, useContext} from 'react'
import { Button, Table } from "react-bootstrap";
import { AppContext } from "../context/appContext";
import axios from "../axios";
import { useSelector } from 'react-redux';
import { Link, useNavigate} from "react-router-dom";
import { useBanUserMutation} from "../services/appApi";
import { useUnbanUserMutation} from "../services/appApi";
// import { useDeleteUserMutation} from "../services/appApi";
import Loading from "./Loading";

function MembersAdminPage() {
    const[users, setUsers] = useState(null)
    const[loading, setLoading] = useState(false)
    const [banUser] = useBanUserMutation();
    const navigate = useNavigate();
    const [unbanUser] = useUnbanUserMutation();
    // const [deleteUser] = useDeleteUserMutation();
    const user = useSelector((state) => state.user)
    const {userBanStatus, setUserBanStatus} = useContext(AppContext);

    // function handleDeleteUser(id) {
    //   if (window.confirm("Are you sure?")) 
    //   deleteUser({user_id: id, admin_id: user}).then(({data}) => {
    //     if(data) {
    //       console.log("Delete success", data)
    //       getRegisteredMembers()

    //     }
    //   })
    // }

    function handleBanStatus(id, banStatus) {
      // logic here
      if (window.confirm("Are you sure?")) 
     
      if(!banStatus) {
       banUser({user_id: id, admin_id: user }).then(({data}) => {
        if (data) {
          setUserBanStatus(data)
          getRegisteredMembers()
        }
       })
      
      } else {
        unbanUser({user_id: id, admin_id: user }).then(({data}) => {
          if (data) {
            setUserBanStatus(data)
            getRegisteredMembers()
          }
        })
      }
      
  }

  async function getRegisteredMembers() {
    try {
      const response = await axios.get("/users")
      setLoading(false);
      setUsers(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  
    console.log("banStatus", userBanStatus)

    useEffect(() => {
        setLoading(true);
        getRegisteredMembers()
    }, []);

    if (loading) return <Loading />;
    if (users?.length == 0) return <h2 className="py-2 text-center">No users yet</h2>;

return (
 
  <Table responsive striped bordered hover>
  <thead>
      <tr>
          <th>No. </th>
          <th>Client Id</th>
          <th>Client Name</th>
          <th>Email</th>
          <th>Action</th>
      </tr>
  </thead>
  <tbody>

  {users && users.map((user, i) => (
          <tr>
              <td>{i + 1}</td>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button variant={user?.isBanned ? "warning" : "danger"} onClick={() => handleBanStatus(user._id, user.isBanned)} style={{textAlign:"center"}}>{user?.isBanned ? "Unban User" : "Ban User"} </Button>
                {/* <Button variant="danger" onClick={() => handleDeleteUser(user._id)} style={{textAlign:"center"}}>Delete User</Button> */}
              </td>
          </tr>
      ))}
  </tbody>
</Table>
)

}

export default MembersAdminPage