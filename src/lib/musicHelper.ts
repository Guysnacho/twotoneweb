/**
 * @description Trims song api response
 * @param songList
 * @returns formattedList
 */
export const formatSongResults = (songList: [any]) => {
	const formattedList = songList.map((song) => {
		return {
			id: song.id,
			title: song.title.split(' - ')[1],
			artist: song.title.split(' - ')[0],
			genres: song.genre,
			year: song.year,
			label: song.label,
			thumbnail: song.thumb,
			cover: song.cover_image
		};
	});

	console.log('formattedList');
	console.log(formattedList);
	return formattedList;
};

// export default { formatSongResults };
