import { h } from 'preact';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<a href="/" class={style.logo}>
			<h1>Peacekeeper USD Profit</h1>
		</a>
	</header>
);

export default Header;
