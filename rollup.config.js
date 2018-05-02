import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const plugins = [
    sourcemaps(),
    nodeResolve({
        preferBuiltins: false
    })
];

if (process.env.ROLLUP_UGLIFY === 'true') {
    plugins.push(uglify());
}

export default {
    external: ['react', 'react-dom'],
    input: 'lib/es6/index.js',
    output: {
        format: 'umd',
        file: 'umd/bundle.js',
        name: 'PurePivot',
        globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
        },
        sourceMap: true
    },
    plugins
};
