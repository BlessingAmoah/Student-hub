--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Postgres.app)
-- Dumped by pg_dump version 17.4 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Notifications_type; Type: TYPE; Schema: public; Owner: blessingsylvester
--

CREATE TYPE public."enum_Notifications_type" AS ENUM (
    'COMMENT',
    'LIKE',
    'FRIEND_REQUEST',
    'MENTORSHIP_REQUEST',
    'MENTORSHIP_RESPONSE'
);


ALTER TYPE public."enum_Notifications_type" OWNER TO blessingsylvester;

--
-- Name: enum_Users_status; Type: TYPE; Schema: public; Owner: blessingsylvester
--

CREATE TYPE public."enum_Users_status" AS ENUM (
    'accepted',
    'rejected',
    'requested',
    'none'
);


ALTER TYPE public."enum_Users_status" OWNER TO blessingsylvester;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comments; Type: TABLE; Schema: public; Owner: blessingsylvester
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    content text NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Comments" OWNER TO blessingsylvester;

--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: blessingsylvester
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comments_id_seq" OWNER TO blessingsylvester;

--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blessingsylvester
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: Friends; Type: TABLE; Schema: public; Owner: blessingsylvester
--

CREATE TABLE public."Friends" (
    id integer NOT NULL,
    "friendName" character varying(255) NOT NULL,
    "friendId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public."Friends" OWNER TO blessingsylvester;

--
-- Name: Friends_id_seq; Type: SEQUENCE; Schema: public; Owner: blessingsylvester
--

CREATE SEQUENCE public."Friends_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Friends_id_seq" OWNER TO blessingsylvester;

--
-- Name: Friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blessingsylvester
--

ALTER SEQUENCE public."Friends_id_seq" OWNED BY public."Friends".id;


--
-- Name: Likes; Type: TABLE; Schema: public; Owner: blessingsylvester
--

CREATE TABLE public."Likes" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Likes" OWNER TO blessingsylvester;

--
-- Name: Likes_id_seq; Type: SEQUENCE; Schema: public; Owner: blessingsylvester
--

CREATE SEQUENCE public."Likes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Likes_id_seq" OWNER TO blessingsylvester;

--
-- Name: Likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blessingsylvester
--

ALTER SEQUENCE public."Likes_id_seq" OWNED BY public."Likes".id;


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: blessingsylvester
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type public."enum_Notifications_type" NOT NULL,
    message character varying(255) NOT NULL,
    read boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO blessingsylvester;

--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: blessingsylvester
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notifications_id_seq" OWNER TO blessingsylvester;

--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blessingsylvester
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: Posts; Type: TABLE; Schema: public; Owner: blessingsylvester
--

CREATE TABLE public."Posts" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    "mediaPath" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public."Posts" OWNER TO blessingsylvester;

--
-- Name: Posts_id_seq; Type: SEQUENCE; Schema: public; Owner: blessingsylvester
--

CREATE SEQUENCE public."Posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Posts_id_seq" OWNER TO blessingsylvester;

--
-- Name: Posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blessingsylvester
--

ALTER SEQUENCE public."Posts_id_seq" OWNED BY public."Posts".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: blessingsylvester
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    bio text,
    "profilePicture" character varying(255),
    "verificationCode" character varying(255),
    "emailVerified" boolean DEFAULT false NOT NULL,
    phone character varying(255),
    address character varying(255),
    city character varying(255),
    state character varying(255),
    school character varying(255),
    major character varying(255),
    interest character varying(255),
    mentorship character varying(255),
    status public."enum_Users_status" DEFAULT 'none'::public."enum_Users_status",
    note text,
    "expirationTimestamp" timestamp with time zone,
    "tokenVersion" integer DEFAULT 0,
    "mentorId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO blessingsylvester;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: blessingsylvester
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO blessingsylvester;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blessingsylvester
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: Friends id; Type: DEFAULT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Friends" ALTER COLUMN id SET DEFAULT nextval('public."Friends_id_seq"'::regclass);


--
-- Name: Likes id; Type: DEFAULT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Likes" ALTER COLUMN id SET DEFAULT nextval('public."Likes_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: Posts id; Type: DEFAULT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Posts" ALTER COLUMN id SET DEFAULT nextval('public."Posts_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: blessingsylvester
--

COPY public."Comments" (id, content, "userId", "postId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Friends; Type: TABLE DATA; Schema: public; Owner: blessingsylvester
--

COPY public."Friends" (id, "friendName", "friendId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Likes; Type: TABLE DATA; Schema: public; Owner: blessingsylvester
--

COPY public."Likes" (id, "userId", "postId", "createdAt", "updatedAt") FROM stdin;
12	5	1	2025-01-09 00:01:18.362+00	2025-01-09 00:01:18.362+00
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: blessingsylvester
--

COPY public."Notifications" (id, "userId", type, message, read, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Posts; Type: TABLE DATA; Schema: public; Owner: blessingsylvester
--

COPY public."Posts" (id, title, content, "mediaPath", "createdAt", "updatedAt", "userId") FROM stdin;
1	Twest		https://studenthubbucket.s3.amazonaws.com/5-1736370488424-1.jpeg	2025-01-08 21:08:10.311+00	2025-01-08 21:08:10.311+00	5
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: blessingsylvester
--

COPY public."Users" (id, email, password, name, bio, "profilePicture", "verificationCode", "emailVerified", phone, address, city, state, school, major, interest, mentorship, status, note, "expirationTimestamp", "tokenVersion", "mentorId", "createdAt", "updatedAt") FROM stdin;
5	bsa5@calvin.edu	$2b$10$3O13cUnhIM1XT6OvxJTJXemh7ThgFCib58bdxlgXjiYcmSz0OaHNW	Blessing	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	none	\N	\N	1	\N	2025-01-08 19:48:32.176+00	2025-02-10 05:53:39.792+00
\.


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blessingsylvester
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 1, false);


--
-- Name: Friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blessingsylvester
--

SELECT pg_catalog.setval('public."Friends_id_seq"', 1, false);


--
-- Name: Likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blessingsylvester
--

SELECT pg_catalog.setval('public."Likes_id_seq"', 12, true);


--
-- Name: Notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blessingsylvester
--

SELECT pg_catalog.setval('public."Notifications_id_seq"', 1, false);


--
-- Name: Posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blessingsylvester
--

SELECT pg_catalog.setval('public."Posts_id_seq"', 1, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blessingsylvester
--

SELECT pg_catalog.setval('public."Users_id_seq"', 5, true);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: Friends Friends_pkey; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_pkey" PRIMARY KEY (id);


--
-- Name: Likes Likes_pkey; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_pkey" PRIMARY KEY (id);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: Posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Comments Comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Posts"(id) ON UPDATE CASCADE;


--
-- Name: Comments Comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Friends Friends_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Friends Friends_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Friends"
    ADD CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Likes Likes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Posts"(id) ON UPDATE CASCADE;


--
-- Name: Likes Likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Likes"
    ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Notifications Notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- Name: Posts Posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Users Users_mentorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blessingsylvester
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

