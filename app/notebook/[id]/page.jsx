"use client"

import { use } from 'react'

export default function Notebook({ params }) {

    const { id } = use(params)

    return (
        <div className="p-4">
            {id}
        </div>
    );
}
