export default async function Home() {

  // server side fetch so the next fetch from back-end Tomcat not Cors neede !!
  const response = await fetch("http://localhost:8080/Hello")

  const data = await response.text()
  console.log(data);
  return (
    <div>
      <h1>{data}</h1>
    </div>
  )
  // <<===>> \\ 
}