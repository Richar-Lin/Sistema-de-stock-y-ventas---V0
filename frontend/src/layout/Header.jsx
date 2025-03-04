// src/components/Header.jsx
const Header = () => {
    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md pr-10">
            <h1 className="text-xl font-bold">Aurora</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="hover:text-orange-400">Nombre</a>
                    </li>
                    <li>
                        <a href="/about" className="hover:text-orange-400">Acerca</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
