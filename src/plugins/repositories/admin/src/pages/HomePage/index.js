import React, { memo, useState, useEffect } from "react";
import { HeaderLayout } from "@strapi/design-system/Layout";
import styled from "styled-components";
import { Table } from "@buffetjs/core";
import axios from "axios";

const Wrapper = styled.div`
  padding: 18px 30px;

  p {
    margin-top: 1rem;
  }
`;

const HomePage = () => {
  const [rows, setRows] = useState([]);

  const headers = [
    {
      name: "Name",
      value: "name",
    },
    {
      name: "Description",
      value: "description",
    },
    {
      name: "Url",
      value: "html_url",
    },
  ];

  const static_rows = [
    {
      name: "landing-page",
      description: "Code to the sales landing page.",
      html_url: "https://github.com/React-Avancado/landing-page",
    },
    {
      name: "links-estudo",
      description: "links interessantes sobre tudo abordado no curso.",
      html_url: "https://github.com/React-Avancado/links-estudo",
    },
    {
      name: "boilerplate",
      description: "Boilerplate to use in our React Avançado course.",
      html_url: "https://github.com/React-Avancado/boilerplate",
    },
    {
      name: "landing-page-api",
      description:
        "API made with Strapi to seed the data our NextJS Landing Page.",
      html_url: "https://github.com/React-Avancado/landing-page-api",
    },
    {
      name: "reactavancado-extensions-pack",
      description:
        "A collection of extension that we use at ReactAvancado.com.br course",
      html_url:
        "https://github.com/React-Avancado/reactavancado-extensions-pack",
    },
  ];

  useEffect(() => {
    axios
      .get("https://api.github.com/users/React-avancado/repos")
      .then((res) => setRows(res.data));
  }, []);

  return (
    <Wrapper>
      <HeaderLayout
        title="React Avançado Repositories"
        subtitle="A list of our repositories in React Avançado course"
      />
      <Table headers={headers} rows={rows} />
    </Wrapper>
  );
};

export default memo(HomePage);
