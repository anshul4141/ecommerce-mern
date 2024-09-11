import { useState, useEffect } from "react";
import axios from "axios";
import {environment} from "../environment.ts"

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const apiUrl = environment.apiUrl;

  //get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/category/get-categories`);
      setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
