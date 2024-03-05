import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

function CreatePostModel({ show, dimensions, setShow }) {
  return (
    <div
      className={`relative z-10 ${!show && "hidden"} `}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-gray-700  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[40rem] ${
              dimensions.width < 640 && "mb-60"
            }`}
          >
            <div className="bg-gray-700  px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                  <lord-icon
                    src="https://cdn.lordicon.com/pbhjpofq.json"
                    trigger="hover"
                    style={{ transform: "scale(1.3)" }}
                    className="testt"
                  ></lord-icon>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h1
                    className="text-xl font-semibold leading-6 text-[white] mt-1"
                    id="modal-title"
                  >
                    Create Post
                  </h1>

                  <div className="col-span-2 mt-4">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-[18px]  font-medium  "
                    >
                      Description
                    </label>
                    <div
                      style={{
                        width:
                          dimensions.width < 564
                            ? dimensions.width - 200
                            : "500px",
                      }}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onReady={(editor) => {
                          console.log(
                            "CKEditor5 React Component is ready to use!",
                            editor
                          );
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          console.log({ event, editor, data });
                        }}
                      />
                    </div>
                  </div>

                  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>

                </div>
              </div>
            </div>
            <div className="bg-gray-700  px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                Add
              </button>
              <button
                onClick={() => setShow(false)}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModel;
