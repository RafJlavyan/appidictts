import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Axios from "@/utils/newRequest";
import { MyButton } from "@/ui";
import { Spacing } from "@/styles/proportions";
import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchTransVideos,
//   updateTransVideos,
// } from "@/stores/transVideoSlice";
import { fetchUserData } from "@/stores/userSlice";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchUserData());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    userId && fetchData();
  }, [dispatch, userId]);

  const removeToken = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      localStorage.removeItem("userId");
      await Axios.post("/auth/logout");
      navigate("/guest");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // const { transVideos } = useSelector((state: any) => state.transVideos);

  // const uploadNewPresignedUrls = async () => {
  //   try {
  //     const updatePromises = transVideos.map((video: any) => {
  //       return Axios.post("/trans-videos/new-presigned-url", {
  //         videoKey: video.video_key,
  //         thumbnailKey: video.thumbnail_key,
  //         videoId: video._id,
  //       });
  //     });
  //     const responses = await Promise.all(updatePromises);

  //     const updatedTransVideos = transVideos.map((video: any, index: number) => ({
  //       ...video,
  //       video_link: responses[index].data.videoUrl,
  //       thumbnail_url: responses[index].data.thumbnailUrl,
  //     }));

  //     dispatch(updateTransVideos(updatedTransVideos));

  //     navigate("/trans-videos-history");
  //   } catch (error) {
  //     console.error("Error uploading new presigned URLs:", error);
  //   }
  // };

  // useEffect(() => {
  //   userData && dispatch(fetchTransVideos());
  // }, [dispatch, userData]);

  return (
    <Component>
      {userData === null ? (
        <GuestProfile>
          <div className="buttons">
            <MyButton
              bg=""
              className="beautiful-button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </MyButton>
            <MyButton
              bg=""
              variant="contained"
              className="beautiful-button"
              onClick={() => navigate("/select-reg-method")}
            >
              Register
            </MyButton>
          </div>
        </GuestProfile>
      ) : (
        <UserProfile>
          <nav>
            <Link to="/my-transactions">Payment history</Link>
            <Link to="/video-translation">Translate video</Link>
            <MyButton
              bg=""
              // onClick={uploadNewPresignedUrls}
            >
              My media
            </MyButton>
            <Link to="/tariffs">Get tariff</Link>
            <Link to="/home">
              <MyButton bg="">My profile</MyButton>
            </Link>
          </nav>
          <div className="user-data">
            <Credits>
              <Link to="/tariffs">Credits {userData?.credits}</Link>
            </Credits>
            <h6>Username: {userData?.username}</h6>
            <MyButton
              bg=""
              className="beautiful-button"
              variant="contained"
              onClick={removeToken}
            >
              log out
            </MyButton>
          </div>
        </UserProfile>
      )}
    </Component>
  );
};

export default Header;

const Component = styled.div`
  padding: ${Spacing.medium.padding};
  .buttons {
    display: flex;
  }

  .buttons button {
    margin: 0 ${Spacing.medium.margin};
  }
`;

const UserProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p,
  a,
  h6 {
    margin: 0 ${Spacing.medium.margin};
  }
  .user-data {
    display: flex;
    align-items: center;
  }
`;

const Credits = styled.p`
  font-size: 16px;
  background-color: gold;
  color: white;
  padding: 5px;
  border-radius: 5px;
`;

const GuestProfile = styled.div`
  display: flex;
  justify-content: flex-end;
`;
