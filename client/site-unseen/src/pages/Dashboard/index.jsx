/* CHARTS */
import {PieChart, Pie, Cell, Legend, CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Bar} from 'recharts'
/*STYLES */
import "./styles.css"

const pieGenderColors = ["blue", "red", "green"]


const Dashboard = ({users, availableUsers, pods, availablePods})=> {

  if(!users?.length){
    return <div>LOADING</div>
  }
  //GENDER
  //MALE
  const maleUsers = users?.filter(user=>user.gender==="male");
  const maleUserCount = maleUsers.length;
  //SEXUAL PREFERENCES
  const heteroSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="female");
  const heteroSexualMaleUserCount = heteroSexualMaleUsers.length;
  const homoSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="male");
  const homoSexualMaleUserCount = homoSexualMaleUsers.length;
  const biSexualMaleUsers = maleUsers.filter(maleUser=>maleUser.sexual_pref=="bisexual");
  const biSexualMaleUserCount = biSexualMaleUsers.length;
  //FEMALE
  const femaleUsers = users?.filter(user=>user.gender==="female");
  const femaleUserCount = femaleUsers.length;
  //SEXUAL PREFERENCES
  const heteroSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="male")
  const heteroSexualFemaleUserCount = heteroSexualfemaleUsers.length;
  const homoSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="female")
  const homoSexualFemaleUserCount = homoSexualfemaleUsers.length;
  const biSexualfemaleUsers = femaleUsers.filter(femaleUser=>femaleUser.sexual_pref=="bisexual")
  const biSexualFemaleUserCount = biSexualfemaleUsers.length;
  //NON-BINARY
  const nonBinaryUsers = users?.filter(user=>user.gender==="non-binary");
  const nonBinaryUserCount = nonBinaryUsers.length;
  const nonBinaryUsersSeekingMale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="male")
  const nonBinaryUsersSeekingMaleCount = nonBinaryUsersSeekingMale.length;
  const nonBinaryUsersSeekingFemale = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="female")
  const nonBinaryUsersSeekingFemaleCount = nonBinaryUsersSeekingFemale.length;
  const nonBinaryBisexualUsers = nonBinaryUsers.filter(nonBinaryUser=>nonBinaryUser.sexual_pref=="bisexual")
  const nonBinaryBisexualUsersCount = nonBinaryBisexualUsers.length;
  /* DATA */
  //Gender Pie Chart
  const genderPieChatData = [{name: "Male", value: maleUserCount}, {name: "Female Users", value: femaleUserCount}, {name: "Nonbinary Users", value: nonBinaryUserCount}];
  //SEXUAL PREFERENCES
     const sexualityBarChart = [
      {
        "name": "Male",
        "Seeking Female": heteroSexualMaleUserCount,
        "Seeking Male": homoSexualMaleUserCount,
        "Bisexual": biSexualMaleUserCount,
      },
      {
        "name": "Female",
        "Seeking Female": homoSexualFemaleUserCount,
        "Seeking Male": heteroSexualFemaleUserCount,
        "Bisexual": biSexualFemaleUserCount,
      },
      {
        "name": "Non-Binary",
        "Seeking Female": nonBinaryUsersSeekingFemaleCount,
        "Seeking Male": nonBinaryUsersSeekingMaleCount,
        "Bisexual": nonBinaryBisexualUsersCount,
      }
    ]
  return (
    <div className="dashboard-tab">   
      <div>

        <div className="charts-section">
          <div className="chart-container">
            <h5>Gender Percentages</h5>
          <PieChart width={600} height={500}>
            <Pie data={genderPieChatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
            <Legend />
            <Tooltip />
              {      genderPieChatData.map((entry, index) => (
              <Cell key={`cell-${index}`} label={entry.name} fill={pieGenderColors[index]}/>
            ))}
            </Pie>
          </PieChart>   
          </div>       
          <div>
            <div className="chart-container">
          <BarChart width={730} height={350} data={sexualityBarChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Seeking Female" fill="#7784d8" />
            <Bar dataKey="Seeking Male" fill="#32cacd" />
            <Bar dataKey="Bisexual" fill="#82ca9d" />
          </BarChart>
          </div>
          </div>         
        </div>
    </div>
    </div>
  );
}

export default Dashboard;