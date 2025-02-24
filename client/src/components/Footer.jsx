import React from "react";
import { FaFacebook, FaDiscord, FaTwitter, FaGithub, FaDribbble } from "react-icons/fa";
import logo from "../assets/image.png"

const socialIcons = {
    facebook: <FaFacebook className="w-5 h-5 hover:text-blue-500" />,
    discord: <FaDiscord className="w-5 h-5 hover:text-purple-500" />,
    twitter: <FaTwitter className="w-5 h-5 hover:text-blue-400" />,
    github: <FaGithub className="w-5 h-5 hover:text-gray-400" />,
    dribbble: <FaDribbble className="w-5 h-5 hover:text-pink-500" />,
};


const Footer = () => {
    return (
        < footer className="bg-white dark:bg-gray-900 mt-auto" >
            <div className="mx-auto w-full max-w-screen-xl p-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="/" className="flex items-center">
                            <img
                                src={logo}
                                className="h-8 me-3"
                                alt="CrowdFunding Logo"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                CrowdFunding
                            </span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        {[
                            {
                                title: "Resources",
                                links: [
                                    { name: "CrowdFunding", href: "/" },
                                    { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
                                ],
                            },
                            {
                                title: "Follow us",
                                links: [
                                    { name: "Github", href: "#" },
                                    { name: "Discord", href: "#" },
                                ],
                            },
                            {
                                title: "Legal",
                                links: [
                                    { name: "Privacy Policy", href: "#" },
                                    { name: "Terms & Conditions", href: "#" },
                                ],
                            },
                        ].map((section) => (
                            <div key={section.title}>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                                    {section.title}
                                </h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    {section.links.map((link) => (
                                        <li key={link.name} className="mb-4">
                                            <a href={link.href} className="hover:underline">
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        © {new Date().getFullYear()}{" "}
                        <a href="/" className="hover:underline">
                            CrowdFunding™
                        </a>
                        . All Rights Reserved.
                    </span>
                    {/* Social Icons */}
                    <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
                        {Object.entries(socialIcons).map(([platform, icon]) => (
                            <a
                                key={platform}
                                href="#"
                                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer >

    )

}

export default Footer;