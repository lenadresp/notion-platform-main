import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ socket }) => {
    const navigate = useNavigate();
    const[posts, setPosts] = useState([]);

    useEffect(() => {
        function fetchPosts() {
            fetch("http://localhost:4000/api")
            .then((res) => response.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
        }
        fetchPosts();
    }, []);
    
    useEffect(() => {
        socket.on("updatePosts", (posts) => setPosts(posts));
    }, [socket]);
    
    const createPostBtn = () => {
        fetchUser();
        navigate("/post/create");
    };
     
    const fetchUser =() => {
        fetch("http://localhost:4000/users")
            .then((res) => res.json())
            .then((data) => {
                const stringData = data.toString();
                localStorage.setItem("users", stringData);
            })
            .catch((err) => console.error(err));
    }

    const readMoreBtn = (postID) => {
        socket.emit("findPost", postID);
    };

    return(
        <div className="home">
            <nav className="home__navbar">
                <h2>HackNotion</h2>
                <div className="home__buttons">
                    <button className="home__createBtn" onClick={createPostBtn}>
                        CREATE POST
                    </button>
                    <Notify />
                </div>
            </nav>
            <div className="posts__container">
                <div className="post">
                    <h3>How to create a new Socket.io client</h3>
                    <button className="post__cta" onClick={readMoerBtn}>
                        READ MORE
                    </button>
                </div>
                <div className="post">
                    <h3>Creating React Native project with Expo</h3>
                    <button className="post__cta" onClick={readMoreBtn}>
                        READ MORE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;