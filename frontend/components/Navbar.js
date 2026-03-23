
export default function Navbar(){
 return (
  <div className="bg-blue-600 text-white p-4 flex justify-between">
   <h1 className="font-bold">CRM Dashboard</h1>
   <div>
    <a href="/dashboard/admin" className="mr-4">Admin</a>
    <a href="/dashboard/counselor">Counselor</a>
   </div>
  </div>
 )
}
