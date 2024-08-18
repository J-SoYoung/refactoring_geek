import React, { useRef, useState } from "react";
import Layout from "../components/myPage/_Layout";
import { UserDataType } from "../types/usedType";
import Icon_Pencile from "../assets/icons/pencil.svg";
import ContentBox from "../components/myPage/ContentBox";
import { useRecoilState } from "recoil";
import { geekChickUser } from "../atoms/userAtom";
import { editUserData } from "../api/setting_firebase";
import { uploadCloudImage } from "../api/uploader";
import { defaultImage } from "../types/utils";

// ⭕ 데이터 형태 세세하게 지정하기 ex)phone 010-1111-1110 하이픈넣기, 주소명 등
const MyProfile = () => {
  const [user, setUser] = useRecoilState(geekChickUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<UserDataType>(user);

  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const imageRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const { name, value } = e.target;
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleClickProfileSave = async () => {
    let updatedUser: UserDataType = { ...editUser };
    if (imageFile) {
      const cloudImage = await uploadCloudImage(imageFile);
      updatedUser = { ...editUser, userAvatar: cloudImage };
    }
    await editUserData(updatedUser, setUser);
    setIsEditing(false);
  };

  const handleClickImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      const urlFile = URL.createObjectURL(file);
      setPreviewImage(urlFile);
    }
  };

  const handleClickCancel = () => {
    setEditUser(user);
    setIsEditing(false);
    setPreviewImage(user.userAvatar ?? "");
  };

  // ⭕이미지 컴포넌트 따로 분리?
  return (
    <Layout title="내 프로필 관리">
      <div className="p-8">
        <div>
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-10 relative">
            {isEditing ? (
              <>
                <img
                  src={previewImage ?? user.userAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <input
                  type="file"
                  multiple
                  onChange={handleClickImageChange}
                  className="mb-4 hidden"
                  ref={imageRef}
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                  <img
                    src={Icon_Pencile}
                    alt="profile_img_edit"
                    onClick={() => imageRef.current?.click()}
                  />
                </button>
              </>
            ) : (
              <img
                src={(user && user.userAvatar) ?? defaultImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
        </div>

        <div className="text-left">
          <ContentBox
            title={"닉네임"}
            value={editUser.nickname ?? ""}
            isEditing={isEditing}
            inputName={"nickname"}
            onChange={handleInputChange}
          />
          <ContentBox
            title={"이름"}
            value={editUser.userName ?? ""}
            isEditing={isEditing}
            inputName={"userName"}
            onChange={handleInputChange}
          />
          <ContentBox
            title={"전화번호"}
            value={editUser.phone ?? ""}
            isEditing={isEditing}
            inputName={"phone"}
            onChange={handleInputChange}
            isBlank={!user.phone}
          />
          <ContentBox
            title={"배송지"}
            value={editUser.address}
            isEditing={isEditing}
            inputName={"address"}
            onChange={handleInputChange}
            isBlank={!user.address}
          />
        </div>

        {isEditing ? (
          <div className="my-20 w-full flex justify-between">
            <button
              onClick={handleClickProfileSave}
              className="w-full py-3 mr-2 bg-[#8F5BBD] rounded-lg text-white"
            >
              저장하기
            </button>
            <button
              onClick={handleClickCancel}
              className="w-full py-3 bg-[#666666] text-white rounded-lg"
            >
              취소하기
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="my-20 w-full py-3 bg-[#8F5BBD] text-white rounded-lg"
          >
            수정하기
          </button>
        )}
      </div>
    </Layout>
  );
};

export default MyProfile;
