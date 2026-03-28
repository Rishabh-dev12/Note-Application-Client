import { io } from "socket.io-client";
import { BASE_URL_PATH } from "../utils/constants";

export const socket = io(BASE_URL_PATH);
