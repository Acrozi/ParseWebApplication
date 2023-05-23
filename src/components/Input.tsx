import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { firestore } from "../main";
import { useNavigate } from "react-router-dom";
import './input.css';

const PLACEHOLDER_CODE = "klistra in din kod här"

const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c#", label: "C#" },
];

const Input = () => {
    const [code, setCode] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0].value);
    const navigate = useNavigate();

    const handleShuffle = async () => {
        let rows = trimLines(code.split('\n'));

        const id = await writeToFirestore(rows, selectedLanguage);

        if (id != null) {
            navigate('/' + id);
        }
    }

    return (
        <div className="input-container">
            <textarea
                className="input-field"
                rows={10}
                cols={50}
                value={code}
                onChange={event => setCode(event.target.value)}
                placeholder={PLACEHOLDER_CODE}
            /><br />
            <select
                className="language-select"
                value={selectedLanguage}
                onChange={event => setSelectedLanguage(event.target.value)}
            >
                {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select><br />
            <button className="shuffle-button" onClick={handleShuffle}>Blanda</button>
        </div>
    )
}

const writeToFirestore = async (rows: string[], selectedLanguage: string): Promise<string | null> => {
    try {
        const time = Date();
        const docRef = await addDoc(collection(firestore, 'parsonItems'), {
            rows: rows,
            date: time,
            language: selectedLanguage
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding document: ', error);
    }
    return null;
}

const trimLines = (rows: string[]): string[] => {
    const nonEmptyRows = rows.filter((row) => row.trim() !== "");
    return nonEmptyRows;
}

export default Input;