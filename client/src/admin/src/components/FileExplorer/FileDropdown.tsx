import React, {FunctionComponent, useState, useRef, useEffect} from "react";

interface FileDropdownProps {
  handleEdit?: Function,
  handleUpload: Function
}

export const FileDropdown: FunctionComponent<FileDropdownProps> = ({handleUpload, handleEdit}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const inputEl = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: Event) => {
    const target = event.target as Node;
    if (ref.current && !ref.current.contains(target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  function triggerUpload () {
    if (inputEl.current) {
      inputEl.current.click();
    }
  }
  function handleSelected () {
    if (inputEl.current) {
      const files = inputEl.current.files
      handleUpload(files);
      setOpen(false);
    } else {
      throw new Error("Input is not set.")
    }
  }

  return (<div className={`dropdown ${isOpen ? "is-active":""}`} ref={ref}>
    <input hidden type="file" ref={inputEl} onChange={handleSelected}/>
    <div className="dropdown-trigger">
      <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={()=>setOpen(!isOpen)}>
        <span>Add file</span>
        <span className="icon is-small">
        <i className="fas fa-angle-down" aria-hidden="true"/>
      </span>
      </button>
    </div>
    <div className="dropdown-menu" id="dropdown-menu" role="menu">
      <div className="dropdown-content">
        <a className="dropdown-item" onClick={triggerUpload}>
          Upload file
        </a>
        <a className={`dropdown-item ${!handleEdit ? "is-hidden":""}`} hidden={!!handleEdit} onChange={()=> handleEdit && handleEdit()}>
          Create file
        </a>
      </div>
    </div>
  </div>);
};
export default FileDropdown;
