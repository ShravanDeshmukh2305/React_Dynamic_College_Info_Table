import React, { useEffect, useState, useRef } from "react";
import "./styles.scss"; 
import { FaSort } from "react-icons/fa"; 

function JsonServer() {
  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [showOptions, setShowOptions] = useState(false); 

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:3031/colleges`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const { id, ...res } = data[0]; 
        setColumns(Object.keys(res)); 
        setRecords(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  
  const handleSort = (option) => {
    let sortedRecords = [...records];
    if (option === "fees") {
      sortedRecords.sort((a, b) =>
        sortOrder === "asc"
          ? parseFloat(a["Course Fees (Rs)"].replace(/,/g, '')) - parseFloat(b["Course Fees (Rs)"].replace(/,/g, ''))
          : parseFloat(b["Course Fees (Rs)"].replace(/,/g, '')) - parseFloat(a["Course Fees (Rs)"].replace(/,/g, ''))
      );
    } else if (option === "userReview") {
      sortedRecords.sort((a, b) =>
        sortOrder === "asc"
          ? a["User Review"] - b["User Review"]
          : b["User Review"] - a["User Review"]
      );
    } else if (option === "collegeName") {
      sortedRecords.sort((a, b) =>
        sortOrder === "asc"
          ? a.College.Name.localeCompare(b.College.Name)
          : b.College.Name.localeCompare(a.College.Name)
      );
    }
    setRecords(sortedRecords);
    setSortBy(option);
  };

  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  
  const filteredRecords = records.filter((record) =>
    record.College.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div>
      <div className="header">
        <div className="search-sort-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          
          <div className="sort-button" ref={dropdownRef}>
            <button
              className="sort-dropdown-button"
              onClick={() => setShowOptions(!showOptions)}
            >
              <FaSort />
            </button>
            {showOptions && (
              <div className="sort-options">
                <button onClick={() => { handleSort("fees"); toggleSortOrder(); }}>
                  Sort by Fees {sortBy === "fees" && (sortOrder === "asc" ? "▲" : "▼")}
                </button>
                <button onClick={() => { handleSort("userReview"); toggleSortOrder(); }}>
                  Sort by User Review Rating {sortBy === "userReview" && (sortOrder === "asc" ? "▲" : "▼")}
                </button>
                <button onClick={() => { handleSort("collegeName"); toggleSortOrder(); }}>
                  Sort by College Name {sortBy === "collegeName" && (sortOrder === "asc" ? "▲" : "▼")}
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record["CD Rank"]}</td>
                <td>
                  <div
                    className="college-info"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div className="imgdiv">
                      <img
                        src={record.College.Logo}
                        alt={record.College.Name}
                        style={{ width: "30px", height: "auto" }}
                        className="college-logo"
                      />
                    </div>
                    <div className="infodiv">
                      <div>
                        <strong>{record.College.Name}</strong>
                      </div>
                      <div>{record.College.Address}</div>
                      <div>{record.College.Branch}</div>
                      <div>{record.College.Cutoff}</div>
                    </div>
                  </div>
                </td>
                <td>{record["Course Fees (Rs)"]}</td>
                <td>{record.Placement}</td>
                <td>{record["User Review"]}</td>
                <td>{record.Ranking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JsonServer;


