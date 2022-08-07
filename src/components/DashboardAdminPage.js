import React, { useEffect, useState } from 'react'
import axios from "../axios";
import Loading from "./Loading";

function DashboardAdminPage() {
    const[users, setUsers] = useState(null)
    const [languages, setLanguages] = useState(null);
    const[loading, setLoading] = useState(false)

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

  async function getLanguages() {
    try {
      const response = await axios.get("/rooms");
      setLoading(false);
      setLanguages(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

    useEffect(() => {
        setLoading(true);
        getRegisteredMembers()
        getLanguages()
    }, []);

    if (loading) return <Loading />;
    if (users?.length == 0) return <h2 className="py-2 text-center">No users yet</h2>;

    console.log('users', users)
return (
 <>
  <div className='row'>
 
  <div className="col-xl-4 col-md-6 mb-4">
  <div className="card border-left-primary shadow h-100 py-2">
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col mr-2">
          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Members</div>
          <div className="h5 mb-0 font-weight-bold text-gray-800">{users?.length}</div>
        </div>
        <div className="col-auto">
          <i className="fas fa-users fa-2x text-gray-300"></i>
        </div>
      </div>
    </div>
  </div>
</div>

  <div className="col-xl-4 col-md-6 mb-4">
  <div className="card border-left-primary shadow h-100 py-2">
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col mr-2">
          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Languages</div>
          <div className="h5 mb-0 font-weight-bold text-gray-800">{languages?.length}</div>
        </div>
        <div className="col-auto">
        <i className="fa-solid fa-globe fa-2x text-gray-300"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

 


</>
)
}

export default DashboardAdminPage;