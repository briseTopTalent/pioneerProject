import React from "react";
import Head from "next/head";

const HeadTab = ({ page }) => {
    return (
        <Head>
            <title>FireWire {page ? "- " + page : ""}</title>
        </Head>
    )
}

export default HeadTab;
