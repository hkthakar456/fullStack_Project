import api from "../../api/axios";

const getRecommendedVideos = async () => {
  const response = await api.get(
    "/videos/recommended_Videos"
  );

  return response.data;
};

const getVideoById = async (videoId) => {

    const response = await api.get(
        `/videos/video/${videoId}`
    );

    return response.data;

};

export {
  getRecommendedVideos,
  getVideoById,
};