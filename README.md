# fullstackbloggerbackend

# _Fullstack Blogger_

### Requirements (Back-End Part 1)

- Create a new github repo called fullstackbloggerbackend, clone the repo to your computer and add the link to populi. Note: when you create this repository, you must add a README, and a node .gitignore template.
- Initialize the repo with express-generator.
- Change the server port to 4000.
- Add the following code, after the line var app = express();, to app.js:
  - var blogsRouter = require('./routes/blogs');
  - app.use('/blogs', blogsRouter);
- Create a new file ./routes/blogs.js.
- Create a new express GET route "hello-blogs" in the ./routes/blogs.js file that sends the following as a response:
  - res.json({message: "hello from express"})
- Run npm start in ./ and navigate to "localhost:4000/blogs/hello-blogs" to see if the above works.

### Requirements (Front-End Part 1)

- Create a new github repo called fullstackbloggerfrontend, clone the repo to your computer and add the link to populi.
- Initialize the repo with create-react-app.
- Install react-router
- Configure react-router by adding <BrowserRouter> to index.js.
- Create a new folder ./src/Pages
- Create a new file ./src/Pages/Blogs.js
- Create and default export a new react component BlogsPage in ./src/Pages/Blogs.js.
- In ./src/App.js, import the <Routes></Routes> component from react-router and add it to the JSX (HTML) of the App component.
- Add a state variable to App called serverJSON, initialized to:
  - {message: null}
- Add the following string as a global variable in ./src/App.js above the App component:
  - const urlEndpoint =
    "http://localhost:4000";
- Add the following useEffect method to App:
  - useEffect(() => {
    const fetchData = async () => {
    const apiResponse = await fetch(`${urlEndpoint}/blogs/hello-blogs`);
    const apiJSON = await apiResponse.json();
    setServerJSON(apiJSON);
    return;
    };
    fetchData();
    }, []);
- In ./src/App.js, import the <Route> component from react-router and the BlogsPage component from ./src/Pages/Blogs.
- In the JSX of App, nest a new <Route> in <Routes> with the path="/blogs" with the element={<BlogsPage message={serverJSON.message}/>}.
- In ./src/Pages/BlogsPage, display the prop variable message in the JSX of the BlogsPage component
  - const BlogsPage = (props) => {
    return (
    <div className="blogs-page">
    <h1>Blogs Page</h1>
    <p>Server Message: {props.message}</p>
    </div>
    )
    }
- Run npm start in ./ and navigate to "localhost:3000/blogs" and if everything has been set up correctly, you should see the following on page:
  - Blogs Page
    Server Message: hello from express

### DAY TWO

- In the fullstackbloggerbackend (Server) repo:

  - Install mongodb and dotenv
    - npm i mongodb dotenv
  - Create a new file ./.env
  - Add your Mongo Atlas connection string to the .env file
    - MONGO_URI=mongodb+srv://<myusername>:<mypassword>@<mycluster>.mongodb.net/?retryWrites=true&w=majority
    - Note: You will need to replace <myusername>, <mypassword>, and <mycluster> with the values for your URI string.
    - Hint: NoSqlBooster will still have your URI stored in the connections window. Click Connect -> Select export to URI.
  - Create a new file ./mongo.js and add the following code to it:

    - const { MongoClient } = require("mongodb");
      require("dotenv").config();

      let db;

      async function mongoConnect() {
      const uri = process.env.MONGO_URI;
      const client = new MongoClient(uri);
      try {
      await client.connect();
      db = await client.db(process.env.MONGO_DATABASE);
      console.log("db connected");
      } catch (error) {
      console.error(error)
      }
      }
      function blogsDB() {
      return db;
      }
      module.exports = {
      mongoConnect,
      blogsDB,
      };

  - Add the following code, after the line var app = express();, to app.js:
    - var { mongoConnect } = require('./mongo.js');
      mongoConnect();
  - Add a new GET route "all-blogs" in ./routes/blogs.js
  - Implement the following functionality in the "all-blogs" route:
    - It should respond with a list of all the blogs currently stored in your blogs database as a JSON object
      - res.send(allBlogs).
      - Hint: Take a look at the "/blogs/all" route in the ExpressJS example repo.

- In the fullstackbloggerfrontend (Client) repo:
  - Modify the useEffect method in the App component to be:
    - useEffect(() => {
      const fetchData = async () => {
      const url = `${urlEndpoint}/blogs/all-blogs`
      const apiResponse = await fetch(url);
      const apiJSON = await apiResponse.json();
      setServerJSON(apiJSON);
      return;
      };
      fetchData();
      }, []);
  - Modify the BlogsPage component to be:
    - const BlogsPage = (props) => {
      return (
      <div className="blogs-page">
      <h1>Blogs Page</h1>
      <p>Server Message: {props.message.map((blog)=>{
      return (
      <>
      {blog.title}
      </>
      )
      })}</p>
      </div>
      )
      }
- Navigate to "localhost:3000/blogs"
  - It should display the titles of all the blogs in your database to the page.
- Stretch Goal: Display the other blog fields to the page along with title. Add css to improve the readability of the page.
