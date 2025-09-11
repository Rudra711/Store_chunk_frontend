// src/components/drive/FolderBreadcrumbs.jsx
import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../../hooks/useFolder";

export default function FolderBreadcrumbs({ currentFolder }) {
  const path = Array.isArray(currentFolder?.path) ? currentFolder.path : [];

  if (currentFolder?._id === "root") {
    return (
      <Breadcrumb className="flex-grow-1" listProps={{ className: "bg-white pl-0 m-0" }}>
        <Breadcrumb.Item active>Root</Breadcrumb.Item>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="flex-grow-1" listProps={{ className: "bg-white pl-0 m-0" }}>
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{
          to: { pathname: "/", state: { folder: ROOT_FOLDER } },
        }}
        className="text-truncate d-inline-block"
        style={{ maxWidth: "150px" }}
      >
        Root
      </Breadcrumb.Item>

      {path.map((f, index) => (
        <Breadcrumb.Item
          key={f._id || index}
          linkAs={Link}
          linkProps={{
            to: {
              pathname: `/folder/${f._id}`,
              state: {
                folder: {
                  ...f,
                  path: path.slice(0, index),
                },
              },
            },
          }}
          className="text-truncate d-inline-block"
          style={{ maxWidth: "150px" }}
        >
          {f.name}
        </Breadcrumb.Item>
      ))}

      <Breadcrumb.Item
        className="text-truncate d-inline-block"
        style={{ maxWidth: "200px" }}
        active
      >
        {currentFolder.name}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
