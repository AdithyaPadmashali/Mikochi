import { h } from "preact";
import { useContext, useState } from "preact/hooks";

import { AuthContext } from "../../jwt";
import Icon, { BigIcon } from "../icon";
import Modal, { ModalContent, ModalHeader } from "../modal";
import "./style.css";
import handleError from "../../error";
import { useStateValue } from "../../../states/provider";
import { actions } from "../../../states";

const UploadModal = ({ isOpen, close, dirPath, refresh, setRefresh }) => {
  const { jwt } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const { dispatch } = useStateValue();

  if (!isOpen) {
    return null;
  }

  const onSubmit = (e) => {
    const upload = async () => {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        dirPath != ""
          ? `/api/upload/${dirPath}/${selectedFile.name}`
          : `/api/upload/${selectedFile.name}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        },
      );

      if (response.status !== 200) {
        setError(await handleError(response));
        return;
      }
      setError("");
      setSelectedFile(null);
      setRefresh(refresh + 1);
      close();
      dispatch({
        type: actions.SHOW_OPERATION_TOAST,
        data: 'File uploaded successfully'
      });
    };

    e.preventDefault();
    upload();
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <ModalHeader close={close}>File upload</ModalHeader>
      <ModalContent>
        <form onSubmit={onSubmit}>
          <label class="fileUpload">
            <Icon name="file-add" />
            <input
              type="file"
              class="hiddenInput"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              aria-label="Select a file"
            />
            &nbsp;
            {selectedFile != null ? (
              <span>{selectedFile.name}</span>
            ) : (
              <span>File</span>
            )}
          </label>
          <button type="submit" class="submit">
            Upload
          </button>
          {error !== "" && <div class="error">{error}</div>}
        </form>
      </ModalContent>
    </Modal>
  );
};

const Upload = ({ dirPath, refresh, setRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div class="floatingUpload">
        <BigIcon
          name="software-upload"
          onClick={() => setModalOpen(true)}
          title="Upload"
        />
      </div>
      <UploadModal
        isOpen={modalOpen}
        close={() => setModalOpen(false)}
        dirPath={dirPath}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default Upload;
